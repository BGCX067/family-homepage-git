class AddDateFieldToActivities < ActiveRecord::Migration
  def change
    add_column :activities, :year, :integer
    add_column :activities, :month, :integer
    add_column :activities, :day, :integer
  end
end
