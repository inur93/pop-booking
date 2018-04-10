package dk.knet.pop.booking.database;

import java.util.List;

import dk.knet.pop.booking.models.PostItem;

public class PostItemDAO extends BasicDAO<PostItem> {

	public PostItemDAO() {
		super(PostItem.class);
	}

	public List<PostItem> getPostsDesc(int page, int number){
		return getPage(page, number);
	}
}
