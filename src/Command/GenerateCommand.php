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
        $data = [
            'version' => Kernel::VERSION,
            'updated_at' => date('r'),
        ];

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
            $data['types'][$i]['definition'] = $this->getTypeOptions($metadata['class']);
        }

        file_put_contents(__DIR__.'/../../docs/data.json', json_encode($data));
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

    private function getClassName(string $class): string
    {
        return \array_slice(explode('\\', $class), -1)[0];
    }

    private function getApiUrl(string $class): string
    {
        return 'http://api.symfony.com/'.$this->apiVersion.'/'.str_replace('\\', '/', $class).'.html';
    }
}
