class VchatController < ApplicationController
	def index
        @api_key = "22676642"        # Replace with your OpenTok API key.
        api_secret = "5f88a4d72917d94131c7bdb0d8bb0e8b0108c12d"  # Replace with your OpenTok API secret.

        if stream = Stream.first
        	# p '#######'
        	# p stream
	        # p @session = stream.stream_session_id
	        # 	    	opentok = OpenTok::OpenTokSDK.new(@api_key, api_secret)

	        # p @token = opentok.generate_token(:session_id => @session)

	    else
	    	p '************'
	    	opentok = OpenTok::OpenTokSDK.new(@api_key, api_secret)
	        session_properties = {OpenTok::SessionPropertyConstants::P2P_PREFERENCE => "enabled"}
	        p @session = opentok.create_session(request.remote_addr, session_properties)
	        @token = opentok.generate_token(:session_id => @session)
	        p s = Stream.new(:stream_session_id => @session.session_id, :token =>@token)
	        p s.save
	   	end
    end
end
