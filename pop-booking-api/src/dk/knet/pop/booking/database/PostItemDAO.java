package dk.knet.pop.booking.database;

import java.util.List;

import dk.knet.pop.booking.models.PostItem;

public class PostItemDAO extends BasicDAO {

	public List<PostItem> getPostsDesc(int page, int number){
		start();
		List<PostItem> posts = simpleGetPage(PostItem.class, page, number);
		end();
		return posts;
	}
	
	public PostItem getById(long id){
		start();
		PostItem item = simpleGet(PostItem.class, id);
		end();
		return item;
	}
	
	public PostItem create(PostItem item){
		start();
		PostItem created = simpleSaveNew(item);
		end();
		return created;
	}
	
	public void delete(PostItem item){
		start();
		simpleDelete(item);
		end();
	}
}
