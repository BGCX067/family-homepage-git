class FamilyTreeController < ApplicationController
  
  # respond_to :html, :json
  
  def index
    # file = "#{Rails.root}/data/family.yaml"
    # @family = Family.new
    # @family.load file
  end
  
  def members
    file = "#{Rails.root}/data/family.yaml"
    @family = Family.new
    @family.load file
    render json: @family
  end
end
