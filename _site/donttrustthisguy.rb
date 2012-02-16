## Required libraries ##
  require 'rubygems'
  require 'sinatra'

## Global Settings ##
  set :public_folder,  Proc.new { File.join(root, "_site") }
  set :protection, :except => :frame_options

## Configuration ##
  configure :production do
    require 'newrelic_rpm'
  end

  IP_BLACKLIST = %w(122.255.96.164 91.196.216.20)

## Before callback ##
  # Added headers for Varnish
  before do
    if ENV['RACK_ENV'] == 'production' and request.path != '/blog'
      response.headers['Cache-Control'] = 'public, max-age=259200'
    end
  end

## Error Handling
  not_found do
    if @not_found.nil?
      @not_found = true
      send_email params, 'views/error_email_template.txt.erb', "Missing Page"
    end
    File.read("_site/404.html")
  end

  error 500..510 do
    send_email params, 'views/error_email_template.txt.erb', "Internal Error"
    File.read("_site/500.html")
  end

## GET requests ##
  ############################################################
  # Redirects
  ############################################################

  # Redirect trailing slash URLs
  get %r{\/(.*)\/$} do |url|
    redirect url, 301
  end

  ############################################################
  # GET routes
  ############################################################
  # Index page
  get '/' do
    page_num = (params[:p] || params[:page_id]).to_i
    if page_num == 1
      redirect "blog", 301
    elsif page_num > 1
      redirect "blog/page/#{page_num}", 301
    else
      File.read("_site/index.html")
    end
  end

  # RSS Feed
  get '/feed' do
    if request.user_agent =~ /FeedBurner/
      content_type 'application/atom+xml', :charset => 'utf-8'
      File.read("_site/atom.xml")
    else
      redirect 'http://feeds.feedburner.com/donttrustthisguyblog', 301
    end
  end

  get %r{^\/blog\/(feed|feed\/atom|blog\/feed)$} do
    redirect 'feed', 301
  end


  # Blitz.io routes
  get '/mu-3dd0acec-2383268f-097a0ad7-4e11727c' do
    '42'
  end

  get '/mu-1b15f325-41eb9c2d-c6972725-c56f1bfb' do
    '42'
  end

  # Catch All
  get "/*" do |title|
    if request.user_agent == '<?php system("id"); ?>' or IP_BLACKLIST.include?(request.ip)
      '' 
    else
      File.read("_site/#{title}/index.html") rescue raise Sinatra::NotFound
    end
  end

__END__

@@ layout
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link href="/stylesheets/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />
    <!--[if IE]>
        <link href="/stylesheets/ie.css" media="screen, projection" rel="stylesheet" type="text/css" />
    <![endif]-->

    <!-- Le HTML5 shim, for IE6-8 support of HTML elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
