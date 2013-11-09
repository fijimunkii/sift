class RemoveTitlesFromIdeas < ActiveRecord::Migration
  def change
    remove_column :ideas, :title
  end
end
