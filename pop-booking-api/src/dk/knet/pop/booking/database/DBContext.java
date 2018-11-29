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

import static dk.vormadal.configservice.Configuration.get;

public class DBContext {

    private SessionFactory factory;

    private static DBContext instance;

    public static DBContext getInstance() {
        if (instance == null) instance = new DBContext();
        return instance;
    }

    private DBContext() {
        final StandardServiceRegistry registry = new StandardServiceRegistryBuilder()
                .configure() // configures settings from hibernate.cfg.xml
                .applySetting("hibernate.connection.username", get("hibernate.connection.username"))
                .applySetting("hibernate.connection.password", get("hibernate.connection.password"))
                .applySetting("hibernate.connection.url", get("hibernate.connection.url"))
                .applySetting("hibernate.show_sql", get("hibernate.show_sql", "false"))
                .applySetting("hibernate.current_session_context_class", get("hibernate.current_session_context_class", "managed"))
                .applySetting("hibernate.hbm2ddl.auto", get("hibernate.hbm2ddl.auto", "update"))
                .build();
        factory = new MetadataSources(registry).buildMetadata().buildSessionFactory();
    }

    public Session getCurrentSession() {
        if (!this.factory.getCurrentSession().isOpen())
            return this.factory.openSession();
        return this.factory.getCurrentSession();
    }

    public static void setup() {
        getInstance().setupDatabase();
    }

    private void setupDatabase() {
        getCurrentSession().beginTransaction();
        setupLanguages();
        setupBookableItems();
        getCurrentSession().getTransaction().commit();

    }

    private void setupLanguages() {
        /*#############################
        Incomment to automatically create default languages on startup
         ##############################*/
       /* List<Language> languages = session.createQuery("from Language", Language.class).getResultList();
        if (languages.size() > 0) return;

        session.save(Language.builder().name("en").displayName("EN").build());
        session.save(Language.builder().name("da").displayName("DA").build());
        session.flush();*/

    }

    private void setupBookableItems() {

        /*##############################
        Incomment to automatically create default bookable items on startup
         ###############################*/
       /* List<BookableItem> existing = session.createQuery("from BookableItem", BookableItem.class).getResultList();
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
        session.flush();*/


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
