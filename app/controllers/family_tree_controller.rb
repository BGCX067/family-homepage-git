class FamilyTreeController < ApplicationController
  
  # respond_to :html, :json
  
  def index
  end
  
  def members
    file = "#{Rails.root}/data/family.yaml"
    @family = Family.new
    @family.load file
    # respond_with @family
    # respond_to do |format|
      # format.html
      # format.json
    # end
    render :json => @family
  end
end
