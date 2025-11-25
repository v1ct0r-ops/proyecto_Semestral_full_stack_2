package cl.duoc.levelup.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
    if (databaseUrl == null || databaseUrl.isEmpty()) {
        // Si no hay DATABASE_URL, usar H2 para desarrollo local
        return DataSourceBuilder.create()
            .url("jdbc:h2:file:./data/levelup_gamer_dev")
            .username("sa")
            .password("")
            .driverClassName("org.h2.Driver")
            .build();
    }

    // Si hay DATABASE_URL, usar Railway/PostgreSQL
        
        try {
            // Parsear Railway PostgreSQL URL
            if (databaseUrl.startsWith("postgresql://")) {
                // Extraer componentes de la URL
                String withoutProtocol = databaseUrl.substring("postgresql://".length());
                String[] userHostSplit = withoutProtocol.split("@");
                String[] userPassSplit = userHostSplit[0].split(":");
                
                String username = userPassSplit[0];
                String password = userPassSplit[1];
                String hostPortDb = userHostSplit[1];
                
                String jdbcUrl = "jdbc:postgresql://" + hostPortDb;
                
                // Retorna el DataSource configurado
                return DataSourceBuilder.create()
                        .url(jdbcUrl)
                        .username(username)
                        .password(password)
                        .driverClassName("org.postgresql.Driver")
                        .build();
            }
            
            // If already JDBC format, use as-is
            return DataSourceBuilder.create()
                    .url(databaseUrl)
                    .driverClassName("org.postgresql.Driver")
                    .build();
                    
        } catch (Exception e) {
            // Si hay error al parsear, lanzar excepción
            throw new RuntimeException("Failed to configure database", e);
        }
    }
}