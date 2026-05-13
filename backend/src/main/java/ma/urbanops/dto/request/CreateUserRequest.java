package ma.urbanops.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.urbanops.enums.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Role role;
    private String phone;
    private String sector;
    private Boolean receiveAlerts;
}
