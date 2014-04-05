class AddUserInfoToUsers < ActiveRecord::Migration
  def change
    add_column :users, :relationship, :string
    add_column :users, :zh_fullname, :string
  end
end
