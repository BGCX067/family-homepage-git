class Activity < ActiveRecord::Base
  belongs_to :user
  has_many :photos
  
  accepts_nested_attributes_for :photos
  
  validates_presence_of :title
  validates_presence_of :desc
end
