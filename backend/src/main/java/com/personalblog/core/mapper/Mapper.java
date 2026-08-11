package com.personalblog.core.mapper;

public interface Mapper<A, T> {
    T mapToType(A entity);
}
