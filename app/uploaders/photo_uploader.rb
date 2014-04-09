# encoding: utf-8

class PhotoUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  storage :file
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end
  
  def cache_dir
    "#{Rails.root}/tmp/#{model.class.to_s.underscore}/uploads"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  version :thumb do
    # TODO: check the original aspect ratio to remove the possible transparent padding
    process :resize_and_pad => [200, 200]
    # process :convert => 'png'
  end
  
  version :small_thumb do
    process :resize_and_pad => [100, 100]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  
  # from here: http://huacnlee.com/blog/carrierwave-upload-store-file-name-config/
  # the above one is not that good, since version names are totally different, which will lead to 
  # the fact that versions cannot be removed after remove method invoked
  # so use method from 
  # https://github.com/carrierwaveuploader/carrierwave/wiki/How-to%3A-Create-random-and-unique-filenames-for-all-versioned-files
  def filename
    # if original_filename
      # @name ||= Digest::MD5.hexdigest(current_path)
      # "#{@name}.#{file.extension}"
    # end
    "#{secure_token}.#{file.extension}" if original_filename.present?
  end
  
  protected
  
  def secure_token
    var = "@#{mounted_as}_secure_token".to_sym
    model.instance_variable_get(var) or model.instance_variable_set(var, SecureRandom.uuid)
  end

end
