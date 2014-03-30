class CreateTmpPhotos < ActiveRecord::Migration
  def change
    create_table :tmp_photos do |t|
      t.string :session_id
      t.integer :user_id
      t.integer :index
      t.string :photo

      t.timestamps
    end
  end
end
