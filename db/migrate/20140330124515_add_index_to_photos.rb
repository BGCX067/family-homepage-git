class AddIndexToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :index, :integer
  end
end
