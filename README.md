# This code is out of date. The latest website code is here: https://github.com/osmus/teachosm.org
## This repo is still being used for Issues.

# teachosm
Test site for teachosm

## install dependencies (recommend ruby version >= 2.3.0)
```
gem install bundler jekyll --user-install
bundle install --path vendor/bundle
```

## running development server
```
bundle exec jekyll serve
```

## running development server on a server
If you are running the development server on a server, you won't be able to access the server's internal localhost from your web browser.  Instead you have to run on host 0.0.0.0 and then access the server through its domain name or IP address.
```
bundle exec jekyll serve --host=0.0.0.0
```
