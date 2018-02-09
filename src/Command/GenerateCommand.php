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
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Generate the form reference data files.
 *
 * @author Yonel Ceruto <yonelceruto@gmail.com>
 */
class GenerateCommand extends Command
{
    protected static $defaultName = 'generate:reference';

    protected function execute(InputInterface $input, OutputInterface $output)
    {

    }
}
