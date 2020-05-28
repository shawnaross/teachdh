# frozen_string_literal: true

require 'fileutils'

task :serve do
  system 'bundle exec jekyll serve'
end

task :deploy do
  system 'env GIT_DEPLOY_DIR="_site" GIT_DEPLOY_BRANCH="gh-pages"'\
    ' /bin/sh _scripts/deploy.sh'
end

namespace :build do
  task :jekyll do
    system 'env JEKYLL_ENV=production bundle exec jekyll build'
  end

  task :compress do
    $stdout.print 'Compressing site.js...'
    $stdout.flush
    Dir.glob('_site/**/*.js') do |filename|
      system "./node_modules/.bin/uglifyjs -o #{filename} #{filename}"
    end
    $stdout.puts 'done'
    $stdout.print 'Compressing *.html...'
    $stdout.flush
    system './node_modules/.bin/html-minifier --input-dir _site' \
      ' --output-dir _site --file-ext html --collapse-whitespace' \
      ' --remove-comments --remove-attribute-quotes --remove-empty-attributes' \
      ' --use-short-doctype --minify-js --minify-css'
    $stdout.puts 'done'
    $stdout.print 'Compressing *.css...'
    $stdout.flush
    Dir.glob('_site/**/*.css') do |filename|
      system "./node_modules/.bin/postcss #{filename} -o #{filename}"
    end
    $stdout.puts 'done'
  end
  task :clean do
    FileUtils.rm_rf('_site/questions')
  end
  task all: %i[jekyll compress clean]
end

task build: ['build:all']
