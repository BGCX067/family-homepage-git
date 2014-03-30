class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :photo
      t.string :desc
      t.integer :activity_id

      t.timestamps
    end
  end
end
