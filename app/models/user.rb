class User < ActiveRecord::Base
  attr_accessor :password, :password_confirmation
  before_save :encrypt_password

  # validates_confirmation_of :password
  # validates_presence_of :password, :on => :create
  # validates_presence_of :email
  # validates_uniqueness_of :email
  # validates_presence_of :name
  # validates_uniqueness_of :name

  EMAIL_REGEX = /A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+z/i
  validates :name, :presence => true, :uniqueness => true, :length => {:in => 3..20}
  validates :email, :presence => true, :uniqueness => true#, :format => EMAIL_REGEX
  #validates :password, :confirmation => true #password_confirmation attr
  #validates_length_of
  validates :password, :confirmation => true, :length => {:in => 5...20}, :on => :create

  private
  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end
end
