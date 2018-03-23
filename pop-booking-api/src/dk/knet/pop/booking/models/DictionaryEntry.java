package dk.knet.pop.booking.models;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created: 21-03-2018
 * Owner: Runi
 */

@NoArgsConstructor
@Getter
@Entity
@Table(name = "dictionary_entry", uniqueConstraints = {@UniqueConstraint(columnNames = {"entry_language", "entry_key"})})
public class DictionaryEntry implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entry_language")
    private String language;

    @Column(name = "entry_key")
    private String key;
    private String value;

}
