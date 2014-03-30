class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.date :date
      t.string :title
      t.text :desc
      t.integer :user_id

      t.timestamps
    end
  end
end
