class CreateStreams < ActiveRecord::Migration
  def change
    create_table :streams do |t|
      t.string :stream_session_id
      t.text :session_token

      t.timestamps
    end
  end
end
