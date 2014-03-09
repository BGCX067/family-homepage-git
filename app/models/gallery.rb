#!/usr/bin/env ruby
#encoding: UTF-8

require 'yaml'

require 'gallery_image'

class Gallery
  @@file = "gallery.yaml"
  
  attr_accessor :images
  
  def initialize
    @images = []
  end
  
  def save
    construct
    open(@@file, "w") do |f|
      f.puts YAML::dump(@images)
    end
  end
  
  def load file
    @images = YAML::load_file file
  end
  
  private
  def construct
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip01.jpg'
    gi.thumbSrc = asset_path 'thumbstrip01.thumb.png'
    gi.title = '1'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip02.jpg'
    gi.thumbSrc = asset_path 'thumbstrip02.thumb.png'
    gi.title = '2'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip03.jpg'
    gi.thumbSrc = asset_path 'thumbstrip03.thumb.png'
    gi.title = '3'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip04.jpg'
    gi.thumbSrc = asset_path 'thumbstrip04.thumb.png'
    gi.title = '4'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip05.jpg'
    gi.thumbSrc = asset_path 'thumbstrip05.thumb.png'
    gi.title = '5'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip06.jpg'
    gi.thumbSrc = asset_path 'thumbstrip06.thumb.png'
    gi.title = '6'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip07.jpg'
    gi.thumbSrc = asset_path 'thumbstrip07.thumb.png'
    gi.title = '7'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip08.jpg'
    gi.thumbSrc = asset_path 'thumbstrip08.thumb.png'
    gi.title = '8'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip09.jpg'
    gi.thumbSrc = asset_path 'thumbstrip09.thumb.png'
    gi.title = '9'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip10.jpg'
    gi.thumbSrc = asset_path 'thumbstrip10.thumb.png'
    gi.title = '10'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip11.jpg'
    gi.thumbSrc = asset_path 'thumbstrip11.thumb.png'
    gi.title = '11'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip12.jpg'
    gi.thumbSrc = asset_path 'thumbstrip12.thumb.png'
    gi.title = '12'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip13.jpg'
    gi.thumbSrc = asset_path 'thumbstrip13.thumb.png'
    gi.title = '13'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip14.jpg'
    gi.thumbSrc = asset_path 'thumbstrip14.thumb.png'
    gi.title = '14'
    @images << gi
    
    gi = GalleryImage.new
    gi.src = asset_path 'thumbstrip15.jpg'
    gi.thumbSrc = asset_path 'thumbstrip15.thumb.png'
    gi.title = '15'
    @images << gi

  end
  
end