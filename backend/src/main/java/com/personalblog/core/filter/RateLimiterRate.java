package com.personalblog.core.filter;

import com.personalblog.core.util.JSONMapper;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@WebFilter("/api/auth/*")
public class RateLimiterRate implements Filter {

    private static final int MAX_REQUEST_FOR_MINUTE = 10;
    //ip address = key, counter of requests = value (atomar)
    private static Map<String, AtomicInteger> ipAddressStorage = new ConcurrentHashMap<>();
    private ScheduledExecutorService executor;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        executor = Executors.newSingleThreadScheduledExecutor();
        executor.scheduleAtFixedRate(() -> ipAddressStorage.clear(), 1, 1, TimeUnit.MINUTES);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        var req = (HttpServletRequest) request;
        var resp = (HttpServletResponse) response;

        String clientIp = getClientIpAddress(req);

        ipAddressStorage.putIfAbsent(clientIp, new AtomicInteger(0));
        int reqCounter = ipAddressStorage.get(clientIp).incrementAndGet();

        if (reqCounter > MAX_REQUEST_FOR_MINUTE) {
            resp.setStatus(429);
            JSONMapper.writeObject(resp, Map.of("Error","Too Many Requests! Please - try again in a minute."));
            return;
        }
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        if (executor != null) {
            executor.shutdown();
        }
    }

    private String getClientIpAddress(HttpServletRequest req) {
        String ip = req.getHeader("X-Forwarded-For");
        String name = "unknown";
        if (ip == null || ip.isEmpty() || name.equalsIgnoreCase(ip)) {
            ip = req.getRemoteAddr();
        }
        return ip;
    }
}
