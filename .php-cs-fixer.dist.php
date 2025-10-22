<?php

$finder = PhpCsFixer\Finder::create()
    ->in([
        __DIR__ . '/Portal_administrador',
        __DIR__ . '/Portal_de_administrador',
        __DIR__ . '/Login',
        __DIR__ . '/Perfil_nutricional',
    ])
    ->name('*.php')
    ->notPath('vendor')
    ->notPath('node_modules')
    ->ignoreDotFiles(true)
    ->ignoreVCS(true);

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'binary_operator_spaces' => ['default' => 'single_space'],
        'blank_line_after_namespace' => true,
        'blank_line_after_opening_tag' => true,
        'no_unused_imports' => true,
        'no_whitespace_before_comma_in_array' => true,
        'trailing_comma_in_multiline' => true,
        'single_quote' => true,
        'indentation_type' => true,
        'line_ending' => true,
        'no_extra_blank_lines' => true,
        'phpdoc_scalar' => true,
        'no_trailing_whitespace' => true,
        'no_leading_import_slash' => true,
        'no_closing_tag' => true,
        'echo_tag_syntax' => ['format' => 'long'],
    ])
    ->setRiskyAllowed(true)
    ->setUsingCache(true)
    ->setCacheFile(__DIR__ . '/.php-cs-fixer.cache')
    ->setFinder($finder);