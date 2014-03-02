#!/usr/bin/env ruby
#encoding: UTF-8

require 'yaml'

require 'member'

class Family

  @@file = "family.yaml"

  attr_accessor :baseId
  attr_accessor :baseMember
  attr_accessor :members
  
  def initialize
    @members = []
  end

  def save
    construct
    open(@@file, "w") do |f|
      f.puts YAML::dump(@members)
      f.puts YAML::dump(@baseMember)
      f.puts YAML::dump(@baseId)
    end
  end

  def load file
    begin
      @members, @baseMember, @baseId = YAML::load_stream(File.open(file))
    rescue => e
      puts e.message
    end
  end

  private
  def construct
    xiangxiang = Member.new
    xiangxiang.name = "顾伊冉"
    xiangxiang.birth = "2013-10-22"
    xiangxiang.gender = "female"
    @members << xiangxiang

    @baseId = xiangxiang.uuid
    @baseMember = xiangxiang

    wife = Member.new
    wife.name = "郑艳花"
    wife.birth = "1985-11-27"
    wife.gender = "female"
    wife.addChild xiangxiang
    @members << wife

    me = Member.new
    me.name = "顾俊"
    me.birth = "1986-07-05"
    me.addWife wife
    me.addChild xiangxiang
    xiangxiang.addParent wife, me
    @members << me

    # xiangxiang.mom = wife
    # xiangxiang.dad = me

    m1 = Member.new
    m1.name = "张巧英"
    m1.gender = "female"
    m1.birth = "1963-6-10"
    m1.addChild me
    @members << m1

    f1 = Member.new
    f1.name = "顾建华"
    f1.birth = "1962-6-10"
    f1.addWife m1
    f1.addChild me
    me.addParent m1, f1
    @members << f1

    # me.mom = m1
    # me.dad = f1

    grand_m1 = Member.new
    grand_m1.name = "朱彩英"
    grand_m1.birth = "1924-12-12"
    grand_m1.gender = "female"
    grand_m1.addChild f1
    @members << grand_m1

    grand_f1 = Member.new
    grand_f1.name = "顾小元"
    grand_f1.birth = "1924-11-11"
    grand_f1.addWife grand_m1
    grand_f1.addChild f1
    @members << grand_f1
    f1.addParent grand_f1, grand_m1

    # f1.mom = grand_m1
    # f1.dad = grand_f1

    grand_m2 = Member.new
    grand_m2.name = "陆妙根"
    grand_m2.birth = "1924-12-12"
    grand_m2.gender = "female"
    grand_m2.alive = false
    grand_m2.death = "2012-05-05"
    grand_m2.addChild m1
    @members << grand_m2

    grand_f2 = Member.new
    grand_f2.name = "张阿梅"
    grand_f2.birth = "1924-11-11"
    grand_f2.alive = false
    grand_f2.death = "2011-10-27"
    grand_f2.addWife grand_m2
    grand_f2.addChild m1
    @members << grand_f2
    m1.addParent grand_f2, grand_m2

    # m1.mom = grand_m2
    # m1.dad = grand_f2

    m2 = Member.new
    m2.name = "陈建球"
    m2.gender = "female"
    m2.birth = "1963-6-10"
    m2.addChild wife
    @members << m2

    f2 = Member.new
    f2.name = "郑栋成"
    f2.birth = "1962-6-10"
    f2.addWife m2
    f2.addChild wife
    wife.addParent f2, m2
    @members << f2

    # wife.mom = m2
    # wife.dad = f2

    grand_m3 = Member.new
    grand_m3.name = "unknow1"
    grand_m3.birth = "1924-12-12"
    grand_m3.gender = "female"
    grand_m3.alive = false
    grand_m3.death = "2011-10-27"
    grand_m3.addChild f2
    @members << grand_m3

    grand_f3 = Member.new
    grand_f3.name = "unknow2"
    grand_f3.birth = "1924-11-11"
    grand_f3.alive = false
    grand_f3.death = "2011-10-27"
    grand_f3.addWife grand_m3
    grand_f3.addChild f2
    @members << grand_f3
    f2.addParent grand_f3, grand_m3

    # f2.mom = grand_m3
    # f2.dad = grand_f3

    grand_m4 = Member.new
    grand_m4.name = "unknow3"
    grand_m4.birth = "1924-12-12"
    grand_m4.gender = "female"
    grand_m4.alive = false
    grand_m4.death = "2011-10-27"
    grand_m4.addChild m2
    @members << grand_m4

    grand_f4 = Member.new
    grand_f4.name = "unknow4"
    grand_f4.birth = "1924-11-11"
    grand_f4.alive = false
    grand_f4.death = "2011-10-27"
    grand_f4.addWife grand_m4
    grand_f4.addChild m2
    m2.addParent grand_f4, grand_m4
    @members << grand_f4
    
    # m2.mom = grand_m4
    # m2.dad = grand_f4

    # Member.new.addChild grand_f1, grand_m1, grand_f2, grand_m2, grand_f3, grand_m3, grand_f4, grand_m4
  end

end

if __FILE__ == $0
  f = Family.new
  f.save
  f.baseId= 5
  f.load
  puts f.baseId.inspect
end
