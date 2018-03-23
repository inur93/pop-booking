package dk.knet.pop.booking.controllers.impl;

import java.util.Date;
import java.util.List;

import javax.ws.rs.core.Response.Status;

import dk.knet.pop.booking.database.PostItemDAO;
import dk.knet.pop.booking.exceptions.AuthorizationException;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.PostItem;

import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_AUTHENTICATION_PERMISSION_DENIED;
import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_POST_ITEM_DOES_NOT_EXIST;

public class PostItemController {

	private PostItemDAO dao = new PostItemDAO();
	
	public PostItem create(PostItem item, BookingUser user){
		item.setCreated(new Date());
		item.setCreatedBy(user);
		return dao.create(item);
	}
	
	public List<PostItem> getPosts(int page, int number){
		List<PostItem> values = dao.getPostsDesc(page, number);
		return values;
	}
	
	public void delete(long id, BookingUser user) throws BasicException {
		PostItem item = dao.getById(id);
		if(item == null) throw new BasicException(Status.BAD_REQUEST, ERROR_POST_ITEM_DOES_NOT_EXIST);
		if(item.getCreatedBy().getId().equals(user.getId())){
			dao.delete(item);
		}else{
			throw new AuthorizationException(Status.FORBIDDEN, ERROR_AUTHENTICATION_PERMISSION_DENIED);
		}
		
		
	}
}
