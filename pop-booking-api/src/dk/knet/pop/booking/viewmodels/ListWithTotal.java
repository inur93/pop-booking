package dk.knet.pop.booking.viewmodels;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Created: 29-03-2018
 * Owner: Runi
 */

@Data
@Builder
@AllArgsConstructor
public class ListWithTotal<T> {

    private int total;
    private List<T> list;
}
