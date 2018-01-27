package dk.knet.pop.booking.controllers;

import java.util.Date;
import java.util.List;

import javax.ws.rs.core.Response.Status;

import dk.knet.pop.booking.database.PostItemDAO;
import dk.knet.pop.booking.exceptions.AuthorizationException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.PostItem;

public class PostItemController {

	private PostItemDAO dao = new PostItemDAO();
	
	public PostItem create(PostItem item, BookingUser user){
		if(item.getCreated() == null) item.setCreated(new Date());
		item.setCreatedBy(user);
		return dao.create(item);
	}
	
	public List<PostItem> getPosts(int page, int number){
		List<PostItem> values = dao.getPostsDesc(page, number);
		return values;
	}
	
	public void delete(long id, BookingUser user) throws AuthorizationException{
		PostItem item = dao.getById(id);
		if(item.getCreatedBy().getId().equals(user.getId())){
			dao.delete(item);
		}else{
			throw new AuthorizationException(Status.FORBIDDEN, "Cannot delete another users post");
		}
		
		
	}
}
