package ma.urbanops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "categories", indexes = {
    @Index(name = "idx_category_name", columnList = "name", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 10)
    private String icon;

    @Column(name = "default_authority", length = 100)
    private String defaultAuthority;

    @Column(name = "authority_email", length = 255)
    private String authorityEmail;

    @Column(length = 500)
    private String description;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @PrePersist
    public void prePersist() {
        if (isActive == null) isActive = true;
    }
}
