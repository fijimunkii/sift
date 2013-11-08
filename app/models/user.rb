# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  email           :string(255)
#  password_digest :string(255)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ActiveRecord::Base

  attr_accessible :email, :password, :password_confirmation

  has_secure_password
  has_many :ideas, :dependent => :destroy
  has_many :tags, :dependent => :destroy

end
