class CreateTagsTable < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :name
      t.integer :idea_id
      t.integer :user_id

      t.timestamps
    end
  end
end
