package de.gnmyt.mcdash.panel.routes;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.gnmyt.mcdash.api.handler.DefaultHandler;
import de.gnmyt.mcdash.api.http.Request;
import de.gnmyt.mcdash.api.http.ResponseController;
import okhttp3.OkHttpClient;
import org.apache.commons.io.FileUtils;
import org.bukkit.Bukkit;

import java.io.File;
import java.util.Base64;


public class ServerInfoRoute extends DefaultHandler {

    private String publicIp = "";

    public ServerInfoRoute() {
    }

    @Override
    public String path() {
        return "server";
    }

    @Override
    public void get(Request request, ResponseController response) throws Exception {


        ObjectNode mapper = new ObjectMapper().createObjectNode()
                .put("software", Bukkit.getName())
                .put("version", Bukkit.getBukkitVersion())
                .put("ip", publicIp)
                .put("port", Bukkit.getPort())
                .put("motd", Bukkit.getMotd())
                .put("icon", "");

        response.header("Content-Type", "application/json").text(mapper.toString());
    }
}
