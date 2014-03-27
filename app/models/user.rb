class User < ActiveRecord::Base
  #attr_accessor :password, :password_confirmation
  attr_accessor :password
  before_save :encrypt_password

  EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
  validates :name, :presence => true, :uniqueness => true, :length => {:in => 3..20}
  validates :email, :presence => true, :uniqueness => true, :format => EMAIL_REGEX
  validates :password, :confirmation => true, :length => {:within => 5..20, :too_short => 'at least 6 characters', :too_long => 'at most 20 characters' }, :on => :create

  private
  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      puts self.password_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
      puts self.password_hash
    end
  end
end
