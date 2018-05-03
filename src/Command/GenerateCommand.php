<?php

/*
 * This file is part of the Symfony Form Reference Generator.
 *
 * (c) Yonel Ceruto <yonelceruto@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

/**
 * Generate the form reference file.
 *
 * @author Yonel Ceruto <yonelceruto@gmail.com>
 */
class GenerateCommand extends Command
{
    protected static $defaultName = 'generate';

    /** @var Command */
    private $command;
    /** @var string */
    private $apiVersion;

    protected function initialize(InputInterface $input, OutputInterface $output)
    {
        $this->command = $this->getApplication()->find('debug:form');
        $this->apiVersion = substr(Kernel::VERSION, 0, 3);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $version = false !== strpos(Kernel::VERSION, '-DEV') ? 'master' : Kernel::VERSION;

        $data = [
            'version' => $version,
            'updated_at' => date('D, d M Y'),
            'composer_info' => $this->getComposerInfo(),
        ];

        // Generate docs content
        $result = $this->runDebugFormCommand();
        $result['types'] = array_merge($result['builtin_form_types'], $result['service_form_types']);
        unset($result['builtin_form_types'], $result['service_form_types']);

        // Setting metadata for all classes
        foreach ($result as $key => $classes) {
            foreach ($classes as $class) {
                $data[$key][] = [
                    'name' => $this->getClassName($class),
                    'class' => $class,
                    'api' => $this->getApiUrl($class),
                ];
            }
        }

        // Setting options metadata for each type
        foreach ($data['types'] as $i => $metadata) {
            $data['types'][$i] += $this->getTypeOptions($metadata['class']);
        }

        // Update versions in docs.json
        $docsFile = __DIR__.'/../../docs/docs.json';
        $docsData = json_decode(file_get_contents($docsFile), true);
        foreach ($docsData['versions'] as $i => $v) {
            if (0 === strpos($v, substr($version, 0, 3))) {
                if ($v !== $version && file_exists($filename = __DIR__.'/../../docs/'.$v.'.json')) {
                    unlink($filename);
                    shell_exec("git rm $filename");
                }
                $docsData['versions'][$i] = $version;
                break;
            }
        }
        file_put_contents($docsFile, json_encode($docsData));

        // Save generated docs content
        file_put_contents(__DIR__.'/../../docs/'.$version.'.json', json_encode($data));
    }

    private function getTypeOptions(string $class): array
    {
        $result = $this->runDebugFormCommand($class);
        unset($result['class'], $result['options']['required']);
        if (!empty($result['options']['own'])) {
            $result['options']['own'] = [$class => $result['options']['own']];
        }

        foreach ($result['options'] as $key => $options) {
            foreach ($options as $groupClass => $opts) {
                foreach ($opts as $j => $option) {
                    $result['options'][$key][$groupClass][$j] = [
                        'name' => $option,
                    ] + $this->runDebugFormCommand($class, $option);
                }

            }
        }

        return $result;
    }

    private function runDebugFormCommand(string $class = null, string $option = null): array
    {
        $arguments = [
            'command' => 'debug:form',
            'class' => $class,
            'option' => $option,
            '--format' => 'json',
        ];
        $bufferedOutput = new BufferedOutput();
        $this->command->run(new ArrayInput($arguments), $bufferedOutput);

        $result = json_decode($bufferedOutput->fetch(), !$option);

        if ($option) {
            // necessary to differentiate object from array on default definition
            return (array) $result;
        }

        return $result;
    }

    private function getComposerInfo()
    {
        $process = new Process('composer info');
        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        return $process->getOutput();
    }

    private function getClassName(string $class): string
    {
        return \array_slice(explode('\\', $class), -1)[0];
    }

    private function getApiUrl(string $class): string
    {
        return 'http://api.symfony.com/'.$this->apiVersion.'/'.str_replace('\\', '/', $class).'.html';
    }
}
