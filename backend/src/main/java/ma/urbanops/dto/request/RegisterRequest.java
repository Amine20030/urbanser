package ma.urbanops.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RegisterRequest {
    @NotBlank String firstName;
    @NotBlank String lastName;
    @NotBlank @Email String email;
    @NotBlank @Size(min=8) String password;
    String phone;
    String sector;
    @Builder.Default Boolean receiveAlerts = true;
}
