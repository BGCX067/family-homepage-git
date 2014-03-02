#!/usr/bin/env ruby
#encoding: UTF-8

# TODO: data validation
class Member
  attr_accessor :uuid
  attr_accessor :name
  attr_accessor :birth # format yyyy-mm-dd
  attr_accessor :alive # [true | false], default true
  attr_accessor :death # nil if alive == true, format yyyy-mm-dd
  attr_accessor :photo
  attr_accessor :gender # ['male' | 'female'], default 'male'
  attr_accessor :wifeId # nil if gender == 'male'
  # attr_accessor :children # []
  # attr_accessor :dad
  # attr_accessor :mom
  attr_accessor :parentsId
  attr_accessor :childrenId

  # following attrs are for rendering
  #attr_accessor :direction # ['ltr' | 'rtl' | 'mid'], default 'ltr'

  @@id = 0 # auto increase the id

  def initialize
    @@id += 1
    @uuid = @@id
    @alive = true
    @gender = 'male'
    @childrenId = nil
    @parentsId = nil
  end

  def addChild *child
    @childrenId = [] if @childrenId.nil?
    child.each do |c|
      @childrenId << c.uuid
    end
  end
  
  def addParent *parent
    @parentsId = [] if @parentsId.nil?
    parent.each do |p|
      @parentsId << p.uuid
    end
  end
  
  def addWife wife
    return if wife.nil?
    @wifeId = wife.uuid if gender == 'male'
  end

end


if __FILE__ == $0
  m1 = Member.new
  m2 = Member.new
  m3 = Member.new
  m1.addChild m2, m3
  m2.addParent m1
  m3.addParent m1
  puts m1.inspect
  puts m2.inspect
end
