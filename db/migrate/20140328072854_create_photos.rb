class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.integer :activity_id
      t.string :photo

      t.timestamps
    end
  end
end
