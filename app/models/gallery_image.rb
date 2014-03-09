#!/usr/bin/env ruby
#encoding: UTF-8

class GalleryImage
  attr_accessor :src
  attr_accessor :thumbSrc
  attr_accessor :title
  
  def initialize
    @src = nil
    @thumbSrc = nil
    @title = ""
  end
  
end