package ru.kata.spring.boot_security.demo.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.vote.RoleVoter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import ru.kata.spring.boot_security.demo.models.UserRole;
import ru.kata.spring.boot_security.demo.services.UserServiceImpl;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    //    private final SuccessUserHandler successUserHandler;
    private final UserDetailsService userDetailsService;

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    public WebSecurityConfig(SuccessUserHandler successUserHandler, UserServiceImpl userService) {
//        this.successUserHandler = successUserHandler;
        this.userDetailsService = userService;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }

    //    @Bean
//    public RoleVoter roleVoter() {
//        RoleVoter roleVoter = new RoleVoter();
//        roleVoter.setRolePrefix("");
//        return roleVoter;
//    }
    @Bean
    GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults("");
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring().antMatchers("/static/css/**", "/js/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        String[] staticResources = {"/static/js/*", "*.js"};
        http
                .cors().disable()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/*").hasRole(UserRole.ADMIN)
                .antMatchers("/common-user").hasRole(UserRole.COMMON_USER)
                .antMatchers("/login", "/logout", "/").permitAll()
                .antMatchers(staticResources).permitAll()
                .anyRequest().authenticated()
                .and()
//                .logout()
//                .logoutUrl("/logout")
//                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK))
////                .logoutSuccessUrl("/login?logout")
//                .invalidateHttpSession(true)
//                .deleteCookies("JSESSIONID")
//                .and()
                .formLogin().disable();
//                .successHandler(successUserHandler).permitAll()
//                .and()
//                .logout().logoutUrl("/logout").logoutSuccessUrl("/").permitAll();
//                .logout().logoutUrl("/logout").permitAll();
    }

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}
