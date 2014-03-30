class Photo < ActiveRecord::Base
  mount_uploader :photo, PhotoUploader
  belongs_to :activity
  
  #validates_presence_of :photo
  
  def set_photo tmp_photo
    puts tmp_photo.inspect
    puts tmp_photo.photo
    self.photo = tmp_photo.photo
    self.index = tmp_photo.index
  end
  
end
