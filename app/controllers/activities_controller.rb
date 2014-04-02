class ActivitiesController < ApplicationController
  
  def new
    @activity = Activity.new
  end
  
  def create
    @activity = Activity.new(activity_params)
    @activity.user_id = current_user.id
    tmp_photos = load_tmp_photo
    new_photos = convert_photo tmp_photos
    @activity.photos = new_photos unless new_photos.nil?
    begin
      @activity.transaction do
        @activity.save!
        tmp_photos.each do |p|
          p.destroy!
        end
      end
      redirect_to welcome_path
    rescue => e
      puts "error: #{e.message}"
      render 'new'
    end
  end
  
  def upload
    photo = params[:photo]
    index = params[:index].to_i
    uploader = store_tmp_photo(index, photo)
    if uploader
      json = {url: uploader.url, thumburl: uploader.thumb.url}
    else
      json = {url: "", thumburl: ""}
    end
    render json: json
  end
  
  def undo_upload
    # TODO: fill in this method
    #index = params[:index].to_i
  end
  
  def show
    #render 'show'
  end
  
  def get_activities
    # TODO: fill this method in
    @from = params[:from]
    @to = params[:to]
    @activities = Activity.all
    @user_id = nil
    @user = current_user
    @user_id = @user.id unless @user.nil?
    json = {activities: @activities, userId: @user_id}
    render json: json
  end
  
  private
  
  def activity_params
    params.require(:activity).permit(:title, :desc, :date)
  end
  
  def store_tmp_photo index, photo
    session_id = request.session_options[:id]
    user_id = current_user.id
    tmp_photo = load_tmp_photo_exact(index) || TmpPhoto.new
    tmp_photo.session_id = session_id
    tmp_photo.user_id = user_id
    tmp_photo.index = index
    tmp_photo.photo = photo
    if tmp_photo.save!
      tmp_photo.photo
    end
  end
  
  def load_tmp_photo
    session_id = request.session_options[:id]
    user_id = current_user.id
    TmpPhoto.where(["session_id = :session_id and user_id = :user_id", {session_id: session_id, user_id: user_id}])
  end
  
  def load_tmp_photo_exact index
    session_id = request.session_options[:id]
    user_id = current_user.id
    TmpPhoto.find_by session_id: session_id, user_id: user_id, index: index
  end
  
  def convert_photo tmp_photos
    tmp_photos.map { |p|
      pho = Photo.new
      pho.set_photo p
      pho
    }
  end
  
end
