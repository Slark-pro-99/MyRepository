import numpy as np
import matplotlib.pyplot as plt

# grid size
nx, ny = 100, 100

# tolerance for convergence
tolerance = 1e-6
max_iterations = 10000

# initialize grid
u = np.zeros((nx, ny))

# boundary conditions
u[:, -1] = 100      # top boundary
'''
for iteration in range(max_iterations):

    u_old = u.copy()

    # Gauss-Seidel update
    for i in range(1, nx-1):
        for j in range(1, ny-1):
            u[i, j] = 0.25 * (
                u[i+1, j] +
                u[i-1, j] +
                u[i, j+1] +
                u[i, j-1]
            )

    # check convergence
    error = np.max(np.abs(u - u_old))
    if error < tolerance:
        print("Converged after", iteration, "iterations")
        break
'''

# this loop is faster than the one above
for iteration in range(max_iterations):

    u_old = u.copy()

    u[1:-1,1:-1] = 0.25 * (
        u[2:,1:-1] +
        u[:-2,1:-1] +
        u[1:-1,2:] +
        u[1:-1,:-2]
    )

    if np.max(np.abs(u - u_old)) < tolerance:
        break

# plot solution
plt.imshow(u, cmap='hot', origin='lower')
plt.colorbar(label="Temperature")
plt.title("2D Laplace Equation Solution")
plt.show()