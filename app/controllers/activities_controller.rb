class ActivitiesController < ApplicationController

def show
   @photos = @activity.photos.all
end

def new
   @activity = Activity.new
   @photos = @activity.photos.build
end

def create
   @activity = Activity.new(activity_params)

   respond_to do |format|
     if @activity.save
	 puts "start to output params #{@activity.photos.inspect}"
       params[:photos]['photo'].each do |a|
			puts "what is a: #{a.inspect}"
			#puts "file name : #{a.url}"
          @photos= @activity.photos.create!(:photo=> a.original_filename, :activity_id => @activity.id)
       end
       format.html { redirect_to @activity, notice: 'Activity was successfully created.' }
     else
       format.html { render action: 'new' }
     end
   end
 end

 private
   def activity_params
      params.require(:activity).permit(:title, photos_attributes: [:id, :activity_id, :photo])
   end
  
end
