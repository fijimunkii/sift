# == Schema Information
#
# Table name: ideas
#
#  id         :integer          not null, primary key
#  title      :string(255)
#  content    :text
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Idea < ActiveRecord::Base

  attr_accessible :title, :content, :user_id

  belongs_to :user

  has_many :tags, :dependent => :destroy

end
