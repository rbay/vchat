class VchatController < ApplicationController
	def index
		if params[:name]
	        @api_key = "22676642"        # Replace with your OpenTok API key.
	        api_secret = "5f88a4d72917d94131c7bdb0d8bb0e8b0108c12d"  # Replace with your OpenTok API secret.
	        p 'jjjjjjjjjjjjjjjj'
	        p params[:streams] = Stream.find(:all).map{|stream| [stream.id, stream.stream_session_id.to_s, stream.session_token]}.to_json.html_safe
	        # if Stream.first
	        	# p '#######'
	        	# p stream
		        # p @session = stream.stream_session_id
		        # 	    	opentok = OpenTok::OpenTokSDK.new(@api_key, api_secret)

		        # p @token = opentok.generate_token(:session_id => @session)

		    # else
		        if params[:stream]
		        	@session = Stream.find(params[:stream]).stream_session_id.to_s
		        	@session_token = Stream.find(params[:stream]).session_token
		        else
		        	if session[:tok_session]
			        	@session = session[:tok_session]
			        	@session_token = session[:tok_session_token]
			        	@publisher = true
			        	@s = session[:stream]
			        else
			        	opentok = OpenTok::OpenTokSDK.new(@api_key, api_secret)
			        	session_properties = {OpenTok::SessionPropertyConstants::P2P_PREFERENCE => "enabled"}
			        	@session = session[:tok_session] = opentok.create_session(request.remote_addr, session_properties)
			        	session_id = @session.session_id
			        	@session_token = session[:tok_session_token] = opentok.generate_token(:session_id => @session)
			        	@publisher = true
			        	@s = session[:stream] = Stream.create(:stream_session_id => session_id, :session_token =>@session_token.to_s)
			        end
		        end
	   		# end
	   	end
    end
end
