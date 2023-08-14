package ru.kata.spring.boot_security.demo.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.kata.spring.boot_security.demo.models.UserRole;
import ru.kata.spring.boot_security.demo.services.UserServiceImpl;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserDetailsService userDetailsService;

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    public WebSecurityConfig(UserServiceImpl userService) {
        this.userDetailsService = userService;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }

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
        String[] staticResources = {"/static/js/*", "*.js", "/css/*"};
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
                .formLogin().disable();
    }

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
