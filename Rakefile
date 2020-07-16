# frozen_string_literal: true

require 'fileutils'

task :serve do
  system 'bundle exec jekyll serve'
end

task :deploy do
  system 'env GIT_DEPLOY_DIR="_site" GIT_DEPLOY_BRANCH="gh-pages"'\
    ' /bin/bash _scripts/deploy.sh'
end

namespace :build do
  task :jekyll do
    system 'env JEKYLL_ENV=production bundle exec jekyll build'
  end
  task :ramda do
    $stdout.print 'Building custom ramda.js...'
    $stdout.flush
    system 'node _scripts/custom-ramda.js `find _site -name "*.js"` > _site/custom-ramda.js'
    system 'node _scripts/custom-ramda.js --insert `find _site -name "*.html"`'
    $stdout.puts 'done'
  end
  task :tachyons do
    $stdout.print 'Building custom tachyons.css...'
    $stdout.flush
    system 'node _scripts/custom-tachyons.js `find _site -name "*.js"` > _site/custom-tachyons.css'
    system 'node _scripts/custom-tachyons.js --insert `find _site -name "*.html"`'
    $stdout.puts 'done'
  end
  task compress: %i[compress:js compress:html compress:css]
  task :embed do
    $stdout.print 'Packing and embedding assets...'
    $stdout.flush
    system 'node _scripts/embed-js.js --delete `find _site -name "*.html"`'
    $stdout.puts 'done'
  end
  task :clean do
    # Remove questions:
    FileUtils.rm_rf('_site/questions')
    # Remove empty asset dirs:
    system 'find _site/ -empty -type d -delete'
  end
  task all: %i[jekyll ramda tachyons compress embed clean]
end

namespace :compress do
  task :js do
    $stdout.print 'Compressing *.js...'
    $stdout.flush
    Dir.glob('_site/**/*.js') do |filename|
      system "npx --no-install uglifyjs -c -m -o #{filename} #{filename}"
    end
    $stdout.puts 'done'
  end
  task :html do
    $stdout.print 'Compressing *.html...'
    $stdout.flush
    system 'npx --no-install html-minifier --input-dir _site' \
      ' --output-dir _site --file-ext html --collapse-whitespace' \
      ' --remove-comments --remove-attribute-quotes --remove-empty-attributes' \
      ' --use-short-doctype --minify-js --minify-css'
    $stdout.puts 'done'
  end
  task :css do
    $stdout.print 'Compressing *.css...'
    $stdout.flush
    Dir.glob('_site/**/*.css') do |filename|
      system "npx --no-install postcss #{filename} -o #{filename}"
    end
    $stdout.puts 'done'
  end
end

task build: ['build:all']
