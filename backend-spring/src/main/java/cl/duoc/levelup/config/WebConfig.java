package cl.duoc.levelup.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos estáticos del cliente desde la carpeta cliente/
        registry.addResourceHandler("/cliente/**")
                .addResourceLocations("file:../cliente/")
                .setCachePeriod(0); // Sin cache para desarrollo

        // Servir la raíz "/" como cliente
        registry.addResourceHandler("/**")
                .addResourceLocations("file:../cliente/")
                .setCachePeriod(0);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirigir la raíz a index.html del cliente
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}