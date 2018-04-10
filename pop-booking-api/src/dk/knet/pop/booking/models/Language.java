package dk.knet.pop.booking.models;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created: 24-03-2018
 * Owner: Runi
 */

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "languages", uniqueConstraints = {@UniqueConstraint(columnNames = {"name"})})
public class Language implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String displayName;
}

