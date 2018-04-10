package dk.knet.pop.booking.database;

import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.Language;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DBContext {

    private Session session;
    private SessionFactory factory;

    private static DBContext instance;

    public static DBContext getInstance() {
        if (instance == null) instance = new DBContext(SessionRegistry.getSessionFactory());
        return instance;
    }

    private DBContext(SessionFactory sessionFactory) {
        factory = sessionFactory;
        this.session = factory.openSession();
    }

    public Session getCurrentSession() {
        if (!this.session.isOpen())
            this.session = factory.openSession();
        return this.session;
    }

    public static void setup() {
        getInstance().setupDatabase();
    }

    private void setupDatabase() {
        session.beginTransaction();
        setupLanguages();
        setupBookableItems();
        session.getTransaction().commit();

    }

    private void setupLanguages() {
        List<Language> languages = session.createQuery("from Language", Language.class).getResultList();
        if (languages.size() > 0) return;

        session.save(Language.builder().name("en").displayName("EN").build());
        session.save(Language.builder().name("da").displayName("DA").build());
        session.flush();

    }

    private void setupBookableItems() {

        List<BookableItem> existing = session.createQuery("from BookableItem", BookableItem.class).getResultList();
        if (existing.size() > 0) return;

        session.save(createBookableItem(BookingType.KANOO_AND_KAJAK, "Canoe 1", "#997ff3", 8));
        session.save(createBookableItem(BookingType.KANOO_AND_KAJAK, "Canoe 2", "#dc6c6c", 8));
        session.save(createBookableItem(BookingType.KANOO_AND_KAJAK, "Canoe 3", "#eceb5d", 8));
        session.save(createBookableItem(BookingType.KANOO_AND_KAJAK, "Canoe 4", "#9a4949", 8));
        session.save(createBookableItem(BookingType.KANOO_AND_KAJAK, "Kayak 1 (Venture kayaks)", "#aee47a", 8));
        session.save(createBookableItem(BookingType.KANOO_AND_KAJAK, "Kayak 2 (Venture kayaks)", "#aee47a", 8));
        session.save(createBookableItem(BookingType.KANOO_AND_KAJAK, "Kayak 3 (Coast spirit)", "#aee47a", 8));
        session.save(createBookableItem(BookingType.KANOO_AND_KAJAK, "Kayak 4 (Baffin)", "#aee47a", 8));
        session.save(createBookableItem(BookingType.MEETINGROOM, "Meetingroom", "#d558e8", 2));
        session.flush();


    }


    private BookableItem createBookableItem(BookingType type, String name, String color, Integer maxBookableHours) {
        return BookableItem.builder()
                .bookingType(type)
                .color(color)
                .maxBookableHours(maxBookableHours)
                .name(name)
                .build();
    }
}
